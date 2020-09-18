let ENV_TYPE = "Local"; // Should be either Local OR Development

/**
 * Canvas lib is used to render image. Install image processing dependent softwares using the below commands
 * FOR OSX : brew install pkg-config cairo pango libpng jpeg giflib librsvg
 * FOR Ubuntu : sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
 * FOR Fedora : sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel
 * 
 * sudo npm install --unsafe-perm=true --allow-root
*/

let config = {
    Local: {
        mode: "http://", // HTTP modes either http:// or https://
        serverReleaseVersion: "1.0.0",
        port: 5000,
        enableApiDoc: true,
        enableCluster: false,
        doPrintLogs: true,
        base_url: "localhost:5000",
        errorLog: {
            filePath: "./Errorlog/log.txt",
        }
    }
}

module.exports = config[ENV_TYPE];
module.exports.ENV_TYPE = ENV_TYPE;
