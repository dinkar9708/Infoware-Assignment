const AccessControl = require("accesscontrol")

const ac = new AccessControl()

exports.roles = (function(){
    ac.grant("basic")
    .readOwn("profile")
    .updateOwn("profile")
    .deleteOwn("profile")
    .readAny("product")

    ac.grant("admin")
    .extend("basic")
    .createAny("product")
    .updateAny("profile")
    .deleteAny("profile")
    .deleteAny("product")

    return ac;

})();