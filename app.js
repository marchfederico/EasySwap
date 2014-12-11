/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , request = require('request')
var events =require('events');
var sys = require('sys');

var EasySwapApp = function() {

    //  Scope.
    var self = this;
    app = this;
    this.reqid = 0;
   this.res= null;
    
self.compile = function(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

self.initializeServer = function() {
this.app = express()

this.app.set('views', __dirname + '/views')
this.app.set('view engine', 'jade')
//app.use(express.logger('dev'))
this.app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: this.compile
  }
))
this.app.use(express.static(__dirname + '/public'))

this.app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})
this.app.get('/searching', function(req, res){
 // input value from search
 var val = req.query.search;

  var url = "http://10.93.234.52:8888/search?text="+val
  
   console.log(url);
    
     self.res = res  
    // request module is used to process the yql url and return the results in JSON format
 request(url, function(err, resp, body) {
         body = JSON.parse(body);
   // logic used to compare search results with the input from user
   if (body!=null) {
     
     theResults = body.SearchResult.Entry
    // console.log(theResults)
     res.render('results',{results:theResults}) 
   
   } else {
      
     console.log(err)
   }
 }) 

 console.log('got here')
 
});
}

self.startServer = function() {
    this.app.listen(3000)
}

}

var theApp = new EasySwapApp();
theApp.initializeServer();
theApp.startServer();

