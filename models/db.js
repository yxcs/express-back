var mysql = require('mysql');
var $conf = require('./config');

// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

module.exports = {

  // 查询文章列表
  queryArticlesLists: function(params, callback) {
    pool.getConnection(function(err, connection) {
      var size = params.size;
      var pageStart = size * (params.page - 1);

      connection.query("SELECT * FROM articles limit ?,?", [pageStart, size], function(err, result1) {
        connection.query("SELECT count(*) as total FROM articles", function(err, result2) {
          var result = {
            data: result1,
            pagination : {
              total: result2[0].total,
              size: size,
              page: params.page
            }
          }
          callback(result);
          connection.release();
        })
      });

    });
  },
  // 通过ID查询文章列表
  queryArticlesById: function(id, callback) {
    var id = +id;
    pool.getConnection(function(err, connection) {
      connection.query("select * from articles where id = ?", id, function(err, result) {
        callback(result)
        connection.release();
      });
    });
  },
  // 通过类型查询文章
  queryArticlesByType: function(params, callback) {
    var size = params.size;
    var pageStart = size * (params.page - 1);
    var type = params.type || 'js';

    pool.getConnection(function(err, connection) {
      connection.query("select * from articles where type = ? limit ?,?", [type, pageStart, size], function(err, result1) {
        connection.query("SELECT count(*) as total FROM articles where type = ?", type, function(err, result2) {
          var result = {
            data: result1,
            pagination : {
              total: result2[0].total,
              size: size,
              page: params.page
            }
          }
          callback(result)
          connection.release();
        })
      });
    });
  },
  // 添加文章
  addArticle: function(params, callback) {
    pool.getConnection(function(err, connection) {
      connection.query('INSERT INTO articles VALUES (null ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [params.title,params.user_id,params.user,params.label_id,params.label,params.state,params.comments,params.see_number,params.like_number,params.created_at,params.update_at,params.close_at,params.img_src,params.body,params.type], function(err, result) {
                console.log(err);
                if(result) {
                  result = {
                    code: 200,
                    msg:'增加成功 articles'
                  };    
                }
                callback(result)
                connection.release();
              });
            });
  },

  // 修改article

  updateArticle: function (params, callback) {
    var $sql = 'UPDATE articles SET title=?,user_id=?,user=?,label_id=?,label=?,state=?,comments=?,see_number=?,like_number=?,update_at=?,close_at=?,img_src=?,body=?,type=? WHERE id = ?';

    pool.getConnection(function(err, connection) {
      connection.query($sql, [params.title,params.user_id,params.user,params.label_id,params.label,params.state,params.comments,params.see_number,params.like_number,params.update_at,params.close_at,params.img_src,params.body,params.type, params.id], function(err, result) {
        
        if(result.affectedRows > 0) {
          result = {
              code: 200,
             msg: '更新成功'
          }
        }else {
          result = err;
        }

        callback(result)
        connection.release();
      });
    });
  },

  // 删除Article  delete by Id

  deleteArticleById: function (id, callback) { 
    var id = +id;
    pool.getConnection(function(err, connection) {
      connection.query("DELETE FROM articles WHERE id= ? ", id, function(err, result) {
        if(result.affectedRows > 0) {
          result = {
            code: 200,
            msg:'删除成功'
          };
        } else {
          result = err;
        }
        callback(result)
        connection.release();
      });
    });
  },

  // 获取label

  getAllLabel: function(callback) {
    pool.getConnection(function(err, connection) {
      connection.query("select * from labels", function(err, result) {
        callback(result)
        connection.release();
      });
    });
  },

  // 获取label by id

  getLabelById: function(id, callback) {
    var id = +id;
    pool.getConnection(function(err, connection) {
      connection.query("select * from labels where id = ?", id, function(err, result) {
        callback(result)
        connection.release();
      });
    });
  },

  // 增加label

  addLabel: function(params, callback) {
    pool.getConnection(function(err, connection) {
      connection.query('INSERT INTO labels VALUES (null ,0, ?,?)', [params.color, params.name], function(err, result) {
                if(result) {
                  result = {
                    code: 200,
                    msg:'增加成功 labels'
                  };    
                }
                callback(result)
                connection.release();
              });
            });
  },

  // 修改label

  updateLabel: function (params, callback) {
    var $sql = 'UPDATE labels SET color = ?, name = ? WHERE id = ?';

    pool.getConnection(function(err, connection) {
      connection.query($sql, [params.color, params.name, params.id], function(err, result) {
        
        if(result.affectedRows > 0) {
          result = {
              code: 200,
             msg: '更新成功'
          }
        }else {
          result = err;
        }

        callback(result)
        connection.release();
      });
    });
  },

  // 删除label  delete by Id

  deleteLabelById: function (id, callback) { 
    var id = +id;
    pool.getConnection(function(err, connection) {
      connection.query("DELETE FROM labels WHERE id= ? ", id, function(err, result) {
        if(result.affectedRows > 0) {
          result = {
            code: 200,
            msg:'删除成功'
          };
        } else {
          result = err;
        }
        callback(result)
        connection.release();
      });
    });
  },

  // 获取所有的user

  getAllUsers: function(callback) {
    pool.getConnection(function(err, connection) {
      connection.query("select * from users", function(err, result) {
        callback(result)
        connection.release();
      });
    });
  },

  // 获取user by id

  getUserById: function(id, callback) {
    var id = +id;
    pool.getConnection(function(err, connection) {
      connection.query("select * from users where id = ?", id, function(err, result) {
        callback(result)
        connection.release();
      });
    });
  },

  // 增加user

  addUser: function(params, callback) {
    pool.getConnection(function(err, connection) {
      connection.query('INSERT INTO users VALUES (null ,?,?,?,?,?,?,?,?)', [params.name, '123456', params.avatr_url, params.age, params.sex, params.work, params.wx, params.phone], function(err, result) {
                if(result) {
                  result = {
                    code: 200,
                    msg:'增加成功 user'
                  };    
                }
                callback(result)
                connection.release();
              });
            });
  },

  // 修改user

  updateUser: function (params, callback) {
    var $sql = 'UPDATE users SET name = ?, avatr_url = ?, age = ?, sex = ?, work = ?, wx = ?, phone = ? WHERE id = ?';

    pool.getConnection(function(err, connection) {
      connection.query($sql, [params.name, params.avatr_url, params.age, params.sex, params.work, params.wx, params.phone, params.id], function(err, result) {
        
        if(result.affectedRows > 0) {
          result = {
              code: 200,
             msg: '更新成功'
          }
        }else {
          result = err;
        }

        callback(result)
        connection.release();
      });
    });
  },

  // 删除user  delete by Id

  deleteUserById: function (id, callback) { 
    var id = +id;
    pool.getConnection(function(err, connection) {
      connection.query("DELETE FROM users WHERE id= ? ", id, function(err, result) {
        if(result.affectedRows > 0) {
          result = {
            code: 200,
            msg:'删除成功'
          };
        } else {
          result = err;
        }
        callback(result)
        connection.release();
      });
    });
  },

  //banner 分页
  queryBannerLists: function(params, callback) {
    pool.getConnection(function(err, connection) {
      var size = params.size;
      var pageStart = size * (params.page - 1);

      connection.query("SELECT * FROM banner limit ?,?", [pageStart, size], function(err, result1) {
        connection.query("SELECT count(*) as total FROM banner", function(err, result2) {
          var result = {
            data: result1,
            pagination : {
              total: result2[0].total,
              size: size,
              page: params.page
            }
          }
          callback(result);
          connection.release();
        })
      });

    });
  },

  // 获取banner
  getBannerByLimit: function(params, callback) {
    pool.getConnection(function(err, connection) {
      connection.query("select * from banner limit ?, ?", [params.start, params.end], function(err, result) {
        callback(result)
        connection.release();
      });
    });
  },

  // 获取Banner by id

  getBannerById: function(id, callback) {
    var id = +id;
    pool.getConnection(function(err, connection) {
      connection.query("select * from banner where id = ?", id, function(err, result) {
        callback(result)
        connection.release();
      });
    });
  },

  // 增加banner
  addBanner: function(params, callback) {
    pool.getConnection(function(err, connection) {
      connection.query('INSERT INTO banner VALUES (null ,?,?,?)', [params.img_src, params.msg, params.article_id], function(err, result) {
                if(result) {
                  result = {
                    code: 200,
                    msg:'增加成功 banner'
                  };    
                }
                callback(result)
                connection.release();
              });
            });
  },

  // 修改banner
  updateBanner: function (params, callback) {
    var $sql = 'UPDATE banner SET img_src = ?, msg = ?, article_id = ? WHERE id = ?';

    pool.getConnection(function(err, connection) {
      connection.query($sql, [params.img_src, params.msg, params.article_id, params.id], function(err, result) {
        
        if(result.affectedRows > 0) {
          result = {
              code: 200,
             msg: '更新成功'
          }
        }else {
          result = err;
        }

        callback(result)
        connection.release();
      });
    });
  },

  // 删除banner  delete by Id

  deleteBannerById: function (id, callback) { 
    var id = +id;
    pool.getConnection(function(err, connection) {
      connection.query("DELETE FROM banner WHERE id= ? ", id, function(err, result) {
        if(result.affectedRows > 0) {
          result = {
            code: 200,
            msg:'删除成功'
          };
        } else {
          result = err;
        }
        callback(result)
        connection.release();
      });
    });
  }



};