export const isDev =  import.meta.env.VITE_PRODUCTION !== 'production'

export const config = {
    PROD: import.meta.env.VITE_PRODUCTION,
    ENCRYPTION_SECRET: import.meta.env.VITE_ENCRYPTION_SECRET,
    JWT_SECRET: import.meta.env.VITE_JWT_SECRET,

    URL: isDev ? import.meta.env.VITE_PROD_BACKEND_SERVER  : import.meta.env.VITE_DEV_BACKEND_SERVER,

    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT,
    GOOGLE_SECRET: import.meta.env.VITE_GOOGLE_SECRET
}