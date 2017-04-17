var express = require('express');
var router = express.Router();
var db = require('../models/db.js');
var formidable = require('formidable');
var path = require('path');
var util = require('util');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/lists', function(req, res, next) {
  let params = req.body;
  if(!params.size) {
  	params.size=10;
  }
  if(!params.page&&params.page < 1) {
  	params.page = 1;
  }

  db.queryArticlesLists(params, function(data) {
  	res.send(data)
  })

});

router.get('/list/:id', function(req, res, next) {
  db.queryArticlesById(req.params.id, function(data) {
  	res.send(data[0])
  })
});

router.post('/lists/type', function(req, res, next) {
  let params = req.body;
  if(!params.size) {
  	params.size=10;
  }
  if(!params.page&&params.page < 1) {
  	params.page = 1;
  }

  db.queryArticlesByType(params, function(data) {
  	res.send(data)
  })
});

router.post('/admin/article/add', function(req, res, next) {
	let params = req.body;
	params.created_at = new Date();
	params.update_at = new Date();
	params.close_at = new Date();
	db.addArticle(params, function(data) {
  		res.send(data)
  	})
})

router.post('/admin/article/update', function(req, res, next) {
	let params = req.body;
	params.update_at = new Date();
	if(params.state == 'CLOSE') {
		params.close_at = new Date();
	}
	db.updateArticle(params, function(data) {
		res.send(data)
	})
})

router.get('/admin/article/delete/:id', function(req, res, next) {
	let id = req.params.id
	db.deleteArticleById(id, function(data) {
		res.send(data)
	})
})

// label添加
router.get('/admin/labels', function(req, res, next) {
	db.getAllLabel(function(data) {
  		res.send(data)
  	})
})

router.post('/admin/labels/add', function(req, res, next) {
	let params = req.body;
	db.addLabel(params, function(data) {
  		res.send(data)
  	})
})

router.post('/admin/labels/update', function(req, res, next) {
	let params = req.body;
	db.updateLabel(params, function(data) {
		res.send(data)
	})
})

router.get('/admin/labels/delete/:id', function(req, res, next) {
	let id = req.params.id
	db.deleteLabelById(id, function(data) {
		res.send(data)
	})
})

router.get('/admin/label/:id', function(req, res, next) {
	let id = req.params.id
	db.getLabelById(id, function(data) {
		res.send(data[0])
	})
})

router.get('/admin/users', function(req, res, next) {
	db.getAllUsers(function(data) {
		res.send(data)
	})
})

router.get('/admin/user/:id', function(req, res, next) {
	let id = req.params.id
	db.getUserById(id, function(data) {
		res.send(data[0])
	})
})

router.post('/admin/users/add', function(req, res, next) {
	let params = req.body;
	db.addUser(params, function(data) {
  		res.send(data)
  	})
})


router.post('/admin/users/update', function(req, res, next) {
	let params = req.body;
	db.updateUser(params, function(data) {
		res.send(data)
	})
})

router.get('/admin/users/delete/:id', function(req, res, next) {
	let id = req.params.id
	db.deleteUserById(id, function(data) {
		res.send(data)
	})
})

// banner 操作
router.post('/banners/lists', function(req, res, next) {
  let params = req.body;
  if(!params.size) {
  	params.size=10;
  }
  if(!params.page&&params.page < 1) {
  	params.page = 1;
  }

  db.queryBannerLists(params, function(data) {
  	res.send(data)
  })

});

router.post('/banners', function(req, res, next) { 
	let params = req.body;
	db.getBannerByLimit(params, function(data) {
		res.send(data)
	})
})

router.get('/banners/one/:id', function(req, res, next) {
	let id = req.params.id
	db.getBannerById(id, function(data) {
		res.send(data[0])
	})
})

router.post('/banner/add', function(req, res, next) {
	let params = req.body;
	db.addBanner(params, function(data) {
		res.send(data)
	})
})

router.post('/banner/update', function(req, res, next) {
	let params = req.body;
	db.updateBanner(params, function(data) {
		res.send(data)
	})
})

router.get('/banner/delete/:id', function(req, res, next) {
	let id = req.params.id
	db.deleteBannerById(id, function(data) {
		res.send(data)
	})
})


// 图片上传接口
router.post('/uploads', function(req, res, next) {
	var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "public/uploads/";
    form.keepExtensions = true; 
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req, function(err, fields, files) {;
    	fs.renameSync(files.imageFile.path, 'public'+path.sep+'uploads'+path.sep+files.imageFile.name);
      	res.send({fields: fields, files: files});
    });
})
module.exports = router;
