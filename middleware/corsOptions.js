const whiteList = ['https://mchnews.herokuapp.com', 'http://example.com' ]

const corsOptions = {
  origin: function(origin, callback) {
    if(whiteList.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
        callback(new Error('Not allowed by CORS'))
    }
  }
}

module.corsOptions = corsOptions;