import { Pool , QueryResult } from 'pg';

 class databasePostgres{
    cnn: any;    
    
    poolConfig = {
        user: process.env.DBUSERTTHH,
        host: process.env.DBHOSTTTHH,
        password: process.env.DBPASSWTTHH,
        database: process.env.DBTTHH,
        port: Number(process.env.DBPORTTTHH)
    }

    async conectarBD(){
        //console.log(`Var Environments: ${JSON.stringify(process.env)}`);
        console.log(this.poolConfig);
        this.cnn = new Pool(this.poolConfig);
        try {
            
            let testconection: QueryResult = await this.cnn.query (`SELECT * from current_database ()`);
            console.log(`Database ${testconection.rows[0].current_database} conected!` );
            //console.log(testconection.rows[0].current_database);
        } catch (error) {
            console.log(`ERROR database conection!: ${error} `);
        }
    }
    
    async querySelect(sql: string, data?: any) {

        let result: QueryResult// = null;
        
        if (!data) {
            result = await this.cnn.query(sql);
            
        } else {
            
            result = await this.cnn.query(sql, data);
            
        }
        //await this.cnn;
        //this.cnn = null;
        
        return result.rows;
    }    
}

const db = new databasePostgres();

export default db;
