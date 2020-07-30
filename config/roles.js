const AccessControl = require("accesscontrol");
const ac = new AccessControl();

const roles = (function() {
  ac.grant("basic")

  ac.grant("admin")
    .extend("basic")
    .readAny("contactList")

  return ac;
})();

module.exports = roles


// next steps 
// 1) assign a role to a user at the beginning 
// 2) add permission check on admin page GET route