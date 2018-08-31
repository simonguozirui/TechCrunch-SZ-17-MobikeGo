var port = 3000;
//port = (port===80?'':':'+port);http://10.9.14.253/
var config = {
    "buildDir": "dist",
    "port": port,

    injectFile: 'src/app/constant/',
    injectName: 'API_URL',
    defaultEnv: 'local',
    "env": {
        "local": {
            apiBase: "//localhost:8080/api",
            channel: "testchannel2017",
            chaincodeName: "example_go",
            chaincodeVersion: "1",
            chaincodePath: "github.com/example"
        }
    }
}

export default config;
