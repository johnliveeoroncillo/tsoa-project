export const omit = <T extends Record<string, any>>(
    obj: T,
    keys: string[],
): T => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key)),
    ) as T;
};

export const pick = <T extends Record<string, any>>(
    obj: T,
    keys: string[],
): T => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => keys.includes(key)),
    ) as T;
};

export const groupBy = <T extends Record<string, any>>(
    array: T[],
    key: string,
): Record<string, T[]> => {
    return array.reduce(
        (acc, item) => {
            const groupKey = item[key];
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(item);
            return acc;
        },
        {} as Record<string, T[]>,
    );
};

export const parseJson = <T extends Record<string, any>>(
    json: string,
): T | string => {
    try {
        return JSON.parse(json) as T;
    } catch (error) {
        return json;
    }
};

export const parseAllJson = <T extends Record<string, any>>(
    json: T | string,
): T | string | T[] => {
    try {
        const parsed = typeof json === 'string' ? JSON.parse(json) : json;

        if (typeof parsed === 'object' && parsed !== null) {
            if (Array.isArray(parsed)) {
                return parsed.map(item => {
                    if (typeof item === 'string') {
                        return parseAllJson(item);
                    }
                    if (typeof item === 'object' && item !== null) {
                        return parseAllJson(JSON.stringify(item));
                    }
                    return item;
                }) as T[];
            }

            // Recursively process object properties
            return Object.fromEntries(
                Object.entries(parsed).map(([key, value]) => {
                    if (typeof value === 'string') {
                        return [key, parseAllJson(value)];
                    }
                    if (typeof value === 'object' && value !== null) {
                        // Recursively process nested objects/arrays
                        return [key, parseAllJson(JSON.stringify(value))];
                    }
                    return [key, value];
                }),
            ) as T;
        }

        return parsed;
    } catch (error) {
        return json as string;
    }
};
