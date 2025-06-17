// vue.config.js
module.exports = {
    publicPath: './',
    devServer: {
        proxy: {
            // /save로 시작하는 요청은 http://localhost:3000 으로 포워딩
            '/save': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                // 필요하면 pathRewrite로 경로 조정 가능
                // pathRewrite: { '^/save': '/save' }
            }
        }
    }
}
