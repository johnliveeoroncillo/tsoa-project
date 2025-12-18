interface MaskConfig {
    fieldPatterns: string[];
    maskFunction: (value: string) => string;
}

const maskConfigs: MaskConfig[] = [
    {
        fieldPatterns: ['email'],
        maskFunction: (value: string) => {
            const [localPart, domain] = value.split('@');
            return domain
                ? `${localPart.substring(0, 2)}***@${domain}`
                : `${localPart.substring(0, 2)}***`;
        },
    },
    {
        fieldPatterns: ['mobile', 'phone', 'contact'],
        maskFunction: (value: string) =>
            value.replace(/(\d{2})\d+(\d{2})/, '$1***$2'),
    },
    {
        fieldPatterns: ['name', 'address'],
        maskFunction: (value: string) => {
            if (value.length === 1) return '*';
            if (value.length === 2) return `${value.substring(0, 1)}*`;
            if (value.length === 3) return '*'.repeat(value.length);
            if (value.length === 4)
                return `${value.substring(0, 1)}**${value.substring(value.length - 1)}`;
            return `${value.substring(0, 2)}***${value.substring(value.length - 2)}`;
        },
    },
];

const defaultMaskFunction = (value: string) => value.replace(/\d/g, '*');

const getMaskFunction = (key: string): ((value: string) => string) => {
    const keyLower = key.toLowerCase();
    const config = maskConfigs.find(config =>
        config.fieldPatterns.some(pattern => keyLower.includes(pattern)),
    );
    return config?.maskFunction || defaultMaskFunction;
};

export const maskInformation = (value: Record<string, any>) => {
    return Object.keys(value).reduce(
        (acc: Record<string, any>, key) => {
            const fieldValue = value[key];

            if (typeof fieldValue === 'string') {
                acc[key] = getMaskFunction(key)(fieldValue);
            } else {
                acc[key] = fieldValue;
            }

            return acc;
        },
        {} as Record<string, any>,
    );
};
