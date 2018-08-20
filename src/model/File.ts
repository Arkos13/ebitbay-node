export interface IFile {
    id: number,
    path: string,
    name: string,
    mime_type: string,
    size: number,
    created: string,
    updated: string,
    file_type: string
}

/**
 * @class File
 * */
export class File implements IFile{
    id: number;
    path: string;
    name: string;
    mime_type: string;
    size: number;
    updated: string;
    created: string;
    file_type: string;
    /**
     * @class Message
     * @param path {string}
     * @param name {string}
     * @param mime_type {string}
     * @param id {number}
     * @param size {number}
     * @param file_type {string}
     * @param created {string}
     * @param updated {string}
     * */
    constructor( id: number,
                 path: string,
                 name: string,
                 mime_type: string,
                 size: number,
                 updated: string,
                 created: string,
                 file_type: string) {}
}