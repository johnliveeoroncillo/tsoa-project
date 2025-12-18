export const IsProduction = () => {
    return (
        process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
    );
};
