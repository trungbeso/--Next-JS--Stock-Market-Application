import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string | undefined;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectionToDatabase = async () => {
    if (!MONGODB_URI) throw new Error('MONGODB_URI must be defined');

    if (cached!.conn) return cached!.conn;

    if (!cached!.promise) {
        cached!.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (err) {
        cached!.promise = null as any;
        throw err;
    }

    console.log('Connected to MongoDB');
    return cached!.conn!;
}

export const verifyMongoConnection = async (): Promise<boolean> => {
    try {
        await connectionToDatabase();
        return true;
    } catch (error) {
        console.error('MongoDB connection check failed:', error);
        return false;
    }
};