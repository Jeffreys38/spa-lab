class AppHelper {
    static showJson(obj: any, mode: "debug" | "error" | "log" ): void {
        switch (mode) {
            case 'log':
                console.log(JSON.stringify(obj, null, 2));
                return;
            case 'debug':
                console.debug(JSON.stringify(obj, null, 2));
                return;
            case 'error' :
                console.error(JSON.stringify(obj, null, 2));
                return;
        }
    }
}

export default AppHelper