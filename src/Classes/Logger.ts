import {bold, red} from 'colors'

export default class Logger {
    public static out(output: any | any[]) {
        if (Array.isArray(output)) {
            console.log(`[${this.gen_date()}] Array Logged`)
            for(let o of output) {
                console.log(`${o.toString()}`)
            }
        }
        return console.log(`[${this.gen_date()}] ${output}`)
    }

    public static err(error: any) {
        this.out(`${bold("[ERROR]")} ${red(error)}`)
    }

    private static gen_date(): string {
        return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }
}