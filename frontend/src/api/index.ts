
class API {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }
}

export default new API("http://127.0.0.1:5000");