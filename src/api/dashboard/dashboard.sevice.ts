import moment from 'moment-timezone';
import { FeedbackStatusConstants } from '../../constants/dashboardDBConstant';
import sequelize from '../../database/config/sequelize';
import WinstonLogger from '../../utils/WinstonLoggerUtil';

interface DashboardDataProps {
    client: string | null;
    location: string | null;
    deliveryGroup: string | null;
    userFeedback?: string | null;
    actionStatus?: string | null;
    userName?: string | null;
    unsatisfiedNUsers?: number | null;
    fromDate?: string | null;
    toDate?: string | null;
    users?: string | null;
    searchValue?: string | null;
}

interface FeedbackStat {
    name: string;
    value: number;
    percentage: string;
}

const NAMESPACE = '[Dashboard]';

interface FilterResult {
    filters: string[];
    replacements: { [key: string]: string | undefined };
}

// Template for the feedback categories
const feedbackTemplate: FeedbackStat[] = [
    { name: FeedbackStatusConstants.Highly_Satisfied, value: 0, percentage: '0.00' },
    { name: FeedbackStatusConstants.Satisfied, value: 0, percentage: '0.00' },
    {
        name: FeedbackStatusConstants.Neither_Satisfied_Nor_Dissatisfied,
        value: 0,
        percentage: '0.00'
    },
    { name: FeedbackStatusConstants.Dissatisfied, value: 0, percentage: '0.00' },
    { name: FeedbackStatusConstants.Highly_Dissatisfied, value: 0, percentage: '0.00' }
];

/* Helper Functions */

// Utility function to parse and clean a string or array input
const parseStringOrArray = (input: string | string[]): string[] => {
    let resultArray: string[] = [];

    if (typeof input === 'string') {
        // Clean and parse the input string
        let cleanedString = input.replace(/^\[|\]$/g, ''); // Remove brackets
        try {
            resultArray = JSON.parse(`[${cleanedString}]`);
            if (!Array.isArray(resultArray)) {
                throw new Error('Parsed input is not an array');
            }
        } catch {
            resultArray = cleanedString
                .split(',')
                .map((value) => value.trim())
                .filter((value) => value);
        }
    } else if (Array.isArray(input)) {
        resultArray = input;
    }

    return resultArray;
};

const generateFiltersAndReplacements = (data: DashboardDataProps): FilterResult => {
    const filters: string[] = [];
    const replacements: { [key: string]: any } = {};

    let clientArray: string[] = [];
    let usersArray: string[] = [];

    if (data.client) {
        clientArray = parseStringOrArray(data.client);
    }

    if (clientArray.length > 0) {
        // Create placeholders for the client values
        const clientPlaceholders = clientArray.map((_, index) => `:client${index}`).join(', ');
        filters.push(`client_name IN (${clientPlaceholders})`);
        clientArray.forEach((client, index) => {
            replacements[`client${index}`] = client;
        });
    }

    if (data.users) {
        usersArray = parseStringOrArray(data.users);
    }

    if (usersArray.length > 0) {
        // Create placeholders for the user_name values
        const clientPlaceholders = usersArray.map((_, index) => `:users${index}`).join(', ');
        filters.push(`user_name IN (${clientPlaceholders})`);
        usersArray.forEach((users, index) => {
            replacements[`users${index}`] = users;
        });
    }

    if (data?.location) {
        filters.push(`user_location = :location`);
        replacements.location = data.location;
    }
    if (data?.deliveryGroup) {
        filters.push(`delivery_group = :deliveryGroup`);
        replacements.deliveryGroup = data.deliveryGroup;
    }
    if (data?.userFeedback) {
        filters.push(`user_feedback = :userFeedback`);
        replacements.userFeedback = data.userFeedback;
    }

    if (data?.actionStatus) {
        filters.push(`action_status = :actionStatus`);
        replacements.actionStatus = data.actionStatus;
    }
    if (data?.userName) {
        filters.push(`user_name = :userName`);
        replacements.userName = data.userName;
    }

    // Handle date range filtering with validation
    if (data?.fromDate && data?.toDate) {
        // Parse dates using the correct format
        const fromDate = moment(data.fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const toDate = moment(data.toDate, 'DD-MM-YYYY').format('YYYY-MM-DD');

        if (moment(fromDate, 'YYYY-MM-DD').isValid() && moment(toDate, 'YYYY-MM-DD').isValid()) {
            filters.push(`feedback_date BETWEEN :fromDate AND :toDate`);
            replacements.fromDate = fromDate;
            replacements.toDate = toDate;
        }
    }

    // Handle searchValue filtering across multiple fields
    if (data?.searchValue) {
        const searchValue = `%${data.searchValue}%`;
        const searchFields = [
            'client_name',
            'user_name',
            'host_name',
            'user_feedback',
            'user_comments',
            'incident_number',
            'action_status',
            'delivery_group',
            'user_location',
            'department'
        ];
        const searchFilters = searchFields
            .map((field) => `${field} LIKE :searchValue`)
            .join(' OR ');
        filters.push(`(${searchFilters})`);
        replacements.searchValue = searchValue;
    }

    return { filters, replacements };
};

// Function to merge feedback stats with the template
const mergeWithTemplate = (feedbackStats: FeedbackStat[][]): FeedbackStat[] => {
    // Flatten the feedbackStats array
    const flattenedFeedbackStats = feedbackStats.flat();

    // Create a map from feedback stats for quick lookup
    const feedbackMap = new Map<string, FeedbackStat>();
    flattenedFeedbackStats.forEach((stat) => feedbackMap.set(stat.name, stat));

    // Merge results with the template
    const mergedFeedbackStats = feedbackTemplate.map((template) => {
        const feedbackStat = feedbackMap.get(template.name);
        return feedbackStat || { ...template };
    });

    return mergedFeedbackStats;
};

const getFeedbackStats = async (data: DashboardDataProps): Promise<FeedbackStat[]> => {
    try {
        // Base query
        let query = `
        SELECT 
            CASE 
                WHEN user_feedback = 'Excellent' THEN 'Highly Satisfied'
                ELSE user_feedback 
            END AS name, 
            COUNT(*) AS value, 
            FORMAT((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM csat_sample)), 2) AS percentage
        FROM 
            csat_sample
        `;

        // Generate filters and replacements
        const { filters, replacements } = generateFiltersAndReplacements(data);

        // Append filters to the query
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(' AND ')}`;
        }

        // Add GROUP BY clause
        query += `
        GROUP BY 
            CASE 
                WHEN user_feedback = 'Excellent' THEN 'Highly Satisfied'
                ELSE user_feedback 
            END
        `;

        // Execute the query
        const feedbackStats = (await sequelize.query(query, {
            replacements
        })) as FeedbackStat[] | any;

        // Merge the query results with the template
        return mergeWithTemplate(feedbackStats);
    } catch (error) {
        console.error('Error fetching feedback stats:', error);
        throw error;
    }
};

const getNetSatisfactionScore = async (data: DashboardDataProps) => {
    try {
        // Base query
        let query = `
SELECT 
    (( 
        (SUM(CASE WHEN user_feedback = 'Highly Satisfied' THEN 1 ELSE 0 END) 
         + SUM(CASE WHEN user_feedback = 'Satisfied' THEN 1 ELSE 0 END)) * 100.0 
        / NULLIF(SUM(
            CASE WHEN user_feedback IN ('Highly Satisfied', 'Satisfied', 'Dissatisfied', 'Highly Dissatisfied', 'Neither Satisfied / Nor Dissatisfied') 
            THEN 1 ELSE 0 END
        ), 0)
    ) - (
        (SUM(CASE WHEN user_feedback = 'Highly Dissatisfied' THEN 1 ELSE 0 END) 
         + SUM(CASE WHEN user_feedback = 'Dissatisfied' THEN 1 ELSE 0 END)) * 100.0 
        / NULLIF(SUM(
            CASE WHEN user_feedback IN ('Highly Satisfied', 'Satisfied', 'Dissatisfied', 'Highly Dissatisfied', 'Neither Satisfied / Nor Dissatisfied') 
            THEN 1 ELSE 0 END
        ), 0)
    )) AS result
FROM 
    csat_sample
WHERE 
    user_feedback IN ('Highly Satisfied', 'Satisfied', 'Dissatisfied', 'Highly Dissatisfied')

        `;
        // let query = `
        //     SELECT
        //         (SUM(CASE WHEN user_feedback = 'Highly Satisfied' THEN 1 ELSE 0 END)
        //          + SUM(CASE WHEN user_feedback = 'Satisfied' THEN 1 ELSE 0 END))
        //         - (SUM(CASE WHEN user_feedback = 'Dissatisfied' THEN 1 ELSE 0 END)
        //            + SUM(CASE WHEN user_feedback = 'Highly Dissatisfied' THEN 1 ELSE 0 END)) AS result
        //     FROM
        //         csat_sample
        //     WHERE
        //         user_feedback IN ('Highly Satisfied', 'Satisfied', 'Dissatisfied', 'Highly Dissatisfied')
        // `;

        // Generate filters and replacements
        const { filters, replacements } = generateFiltersAndReplacements(data);

        // Append filters to the query
        if (filters.length > 0) {
            query += ` AND ${filters.join(' AND ')}`;
        }

        // Execute the query
        const [results] = await sequelize.query(query, {
            replacements
        });

        // Return the result
        return results.length > 0 ? (results[0] as any).result || 0 : 0;
    } catch (error) {
        throw error;
    }
};

const getIssueReportedCountByLocation = async (data: DashboardDataProps) => {
    try {
        // Base query
        let query = `
            SELECT
                user_location AS name,
                COUNT(*) AS value
            FROM
                csat_sample
            WHERE
                action_status = 'Issue Reported'
                AND user_location IS NOT NULL
                AND TRIM(user_location) <> ''
                AND user_location <> 'undefined'
        `;

        // Generate filters and replacements
        const { filters, replacements } = generateFiltersAndReplacements(data);

        // Append filters to the query
        if (filters.length > 0) {
            query += ` AND ${filters.join(' AND ')}`;
        }

        // Add GROUP BY and ORDER BY clauses
        query += `
            GROUP BY
                user_location
            ORDER BY
                value DESC
            LIMIT 5
        `;

        // Execute the query using Sequelize
        const [result] = await sequelize.query(query, {
            replacements
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const getIssueReportedCountByDeliveryGroup = async (data: DashboardDataProps) => {
    try {
        // Base query
        let query = `
            SELECT
                delivery_group AS name,
                COUNT(*) AS value
            FROM
                csat_sample
            WHERE
                action_status = 'Issue Reported'
                AND delivery_group IS NOT NULL
                AND TRIM(delivery_group) <> ''
                AND delivery_group <> 'undefined'
        `;

        // Generate filters and replacements
        const { filters, replacements } = generateFiltersAndReplacements(data);

        // Append filters to the query
        if (filters.length > 0) {
            query += ` AND ${filters.join(' AND ')}`;
        }

        // Add GROUP BY and ORDER BY clauses
        query += `
            GROUP BY
                delivery_group
            ORDER BY
                value DESC
            LIMIT 5
        `;

        // Execute the query using Sequelize
        const [result] = await sequelize.query(query, {
            replacements
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const getUnsatisfiedUserList = async (data: DashboardDataProps) => {
    try {
        let query = `
            SELECT 
                client_name,
                user_name,
                COUNT(*) AS negative_feedback_count,
                delivery_group,
                user_location,
                department
            FROM 
                csat_sample
            WHERE 
                user_feedback IN ('Highly Dissatisfied', 'Dissatisfied')
       `;

        // Generate filters and replacements
        const { filters, replacements } = generateFiltersAndReplacements(data);

        // Append filters to the query
        if (filters.length > 0) {
            query += ` AND ${filters.join(' AND ')}`;
        }

        // Add GROUP BY and ORDER BY clauses
        query += `
          GROUP BY 
                client_name,
                user_name,
                delivery_group,
                user_location,
                department
            ORDER BY 
                negative_feedback_count DESC
            LIMIT ${data.unsatisfiedNUsers ?? 25}
      `;

        // Execute the query using Sequelize
        const [result] = await sequelize.query(query, {
            replacements
        });

        return result;
    } catch (error: any) {
        throw error;
    }
};

export const getDashboardData = async (data: DashboardDataProps) => {
    try {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Attempting to fetch device dashboard data.`,
            level: 'info'
        });

        const [
            userFeedbackChartData,
            netSatisfactionScore,
            issueReportedCountByLocation,
            issueReportedCountByDeliveryGroup,
            unsatisfiedUserList
        ] = await Promise.all([
            getFeedbackStats(data),
            getNetSatisfactionScore(data),
            getIssueReportedCountByLocation(data),
            getIssueReportedCountByDeliveryGroup(data),
            getUnsatisfiedUserList(data)
        ]);

        WinstonLogger.logger.log({
            message: `${NAMESPACE} Successfully fetched the dashboard data.`,
            level: 'info'
        });

        return {
            userFeedbackChartData,
            netSatisfactionScore: Number(parseFloat(netSatisfactionScore).toFixed(2)),
            issueReportedCountByLocation,
            issueReportedCountByDeliveryGroup,
            unsatisfiedUserList
        };
    } catch (error: any) {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Error occurred while fetching the dashboard data: ${error.message}`,
            level: 'error'
        });
        throw error;
    }
};

export const getDeliveryGroupList = async () => {
    try {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Attempting to fetch delivery group list.`,
            level: 'info'
        });

        const query = `
        SELECT DISTINCT delivery_group
        FROM csat_sample
        WHERE delivery_group IS NOT NULL
        AND TRIM(delivery_group) <> ''
        AND delivery_group <> 'undefined';
       `;

        const [result]: any = await sequelize.query(query);

        WinstonLogger.logger.log({
            message: `${NAMESPACE} Successfully fetched the delivery group list.`,
            level: 'info'
        });

        return result;
    } catch (error: any) {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Error occurred while fetching the delivery group list: ${error.message}`,
            level: 'error'
        });
        throw error;
    }
};

export const getLocationList = async () => {
    try {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Attempting to fetch location list.`,
            level: 'info'
        });

        const query = `
        SELECT DISTINCT user_location
        FROM csat_sample
        WHERE user_location IS NOT NULL
        AND TRIM(user_location) <> ''
        AND user_location <> 'undefined';
       `;

        const [result]: any = await sequelize.query(query);

        WinstonLogger.logger.log({
            message: `${NAMESPACE} Successfully fetched the location list.`,
            level: 'info'
        });

        return result;
    } catch (error: any) {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Error occurred while fetching the location list: ${error.message}`,
            level: 'error'
        });
        throw error;
    }
};

export const getClientList = async () => {
    try {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Attempting to fetch client list.`,
            level: 'info'
        });

        const query = `
        SELECT DISTINCT client_name
        FROM csat_sample
        WHERE client_name IS NOT NULL
        AND TRIM(client_name) <> ''
        AND client_name <> 'undefined';
       `;

        const [result]: any = await sequelize.query(query);

        WinstonLogger.logger.log({
            message: `${NAMESPACE} Successfully fetched the client list.`,
            level: 'info'
        });

        return result;
    } catch (error: any) {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Error occurred while fetching the client list: ${error.message}`,
            level: 'error'
        });
        throw error;
    }
};

export const getUsersList = async () => {
    try {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Attempting to fetch Users list.`,
            level: 'info'
        });

        const query = `
        SELECT DISTINCT user_name
        FROM csat_sample
        WHERE user_name IS NOT NULL
        AND TRIM(user_name) <> ''
        AND user_name <> 'undefined';
       `;

        const [result]: any = await sequelize.query(query);

        WinstonLogger.logger.log({
            message: `${NAMESPACE} Successfully fetched the Users list.`,
            level: 'info'
        });

        return result;
    } catch (error: any) {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Error occurred while fetching the Users list: ${error.message}`,
            level: 'error'
        });
        throw error;
    }
};

export const getSelectedGraphRecordList = async (
    data: DashboardDataProps & { page: number; pageSize: number }
) => {
    try {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Attempting to fetch Selected Graph Record List.`,
            level: 'info'
        });

        let query = `
        SELECT  *
        FROM csat_sample
       `;

        // Generate filters and replacements
        const { filters, replacements } = generateFiltersAndReplacements(data);

        // Append filters to the query
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(' AND ')}`;
        }

        if (data.page && data.pageSize) {
            query += ` LIMIT ${data.pageSize} OFFSET ${data.pageSize * (data.page - 1)} `;
        }

        const [result] = await sequelize.query(query, {
            replacements
        });

        WinstonLogger.logger.log({
            message: `${NAMESPACE} Successfully fetched Selected Graph Record List.`,
            level: 'info'
        });

        return result;
    } catch (error: any) {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} Error occurred while fetching Selected Graph Record List: ${error.message}`,
            level: 'error'
        });
        throw error;
    }
};
