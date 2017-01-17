const authorizer = require("../authorizers/build")

var decodeb64 = (str) => {
  return new Buffer(str, 'base64').toString('utf8');
}

module.exports = {
  find: (req, res) => {
    Build.find({ user: req.user.id }).populate("user").populate("site").then(builds => {
      res.json(builds)
    })
  },

  findOne: (req, res) => {
    let build

    Build.findOne(req.param("id")).populate("user").populate("site").then(model => {
      if (model) {
        build = model
      } else {
        res.notFound()
      }
      return authorizer.findOne(req.user, build)
    }).then(() => {
      res.json(build)
    }).catch(err => {
      res.error(err)
    })
  },

  restart: (req, res) => {
    let build

    Build.findOne(req.param("id")).then(model => {
      build = model
      return authorizer.restart(req.user, build)
    }).then(() => {
      return Build.create({
        branch: build.branch,
        site: build.site,
        user: req.user.id,
      })
    }).then(build => {
      return Build.findOne(build.id).populate("user").populate("site")
    }).then(build => {
      res.json(build)
    }).catch(err => {
      res.error(err)
    })
  },

  status: (req, res) => {
    var message = decodeb64(req.body.message)

    Build.findOne(req.param("id")).then(build => {
      if (!build) {
        throw 404
      } else {
        return Build.completeJob(message, build)
      }
    }).then(build => {
      res.ok()
    }).catch(err => {
      res.error(err)
    })
  },
}
