export type JsonPatchType = {
    body: {
        op: string;
        path: string;
        value: string | string[] | null;
    }[]
};
