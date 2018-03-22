var env = process.env.NODE_ENV;

if (env === "production") {
    module.exports = { MONGODB_URI: 'mongodb://Tony:LILTONYlb26@ds221339.mlab.com:21339/vidjot-prod'}
} else {
    module.exports = { MONGODB_URI: 'mongodb://localhost:27017/vidjot'}
}
