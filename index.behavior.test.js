const assert = require("assert");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

function testBannerTabExists() {
  assert(html.includes('data-tab="banners"'), "banner tab should be present");
  assert(html.includes('id="bannerSidebar"'), "banner sidebar should be present");
}

function testBannerUploadAndDeleteHandlersExist() {
  assert(html.includes('id="bannerImageInput"'), "banner upload input should be rendered");
  assert(html.includes("function onBannerImageChange"), "banner upload handler should exist");
  assert(html.includes("function deleteBanner"), "banner delete handler should exist");
}

function testAdminScriptSyntax() {
  const match = html.match(/<script>([\s\S]*)<\/script>/);
  assert(match, "admin script should exist");
  new Function(match[1]);
}

function testProductFormDoesNotUseRegistrationNumber() {
  assert(!html.includes("pf_reg"), "product form should not include registration number input");
  assert(!html.includes("registration_number"), "admin page should not read or save registration_number");
  assert(!html.includes("登记号"), "admin page should not display registration number");
}

Promise.resolve()
  .then(testBannerTabExists)
  .then(testBannerUploadAndDeleteHandlersExist)
  .then(testAdminScriptSyntax)
  .then(testProductFormDoesNotUseRegistrationNumber)
  .then(() => {
    console.log("admin banner behavior tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
