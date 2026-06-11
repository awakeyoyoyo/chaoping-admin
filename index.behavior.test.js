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

function testProductThumbnailUsesWhiteCanvasBackground() {
  const drawIndex = html.indexOf("ctx.drawImage(image, 0, 0, canvas.width, canvas.height)");
  const fillIndex = html.indexOf("ctx.fillStyle = '#ffffff'");
  assert(fillIndex >= 0, "thumbnail canvas should set white fill style");
  assert(
    fillIndex >= 0 && fillIndex < drawIndex,
    "thumbnail canvas should fill white before drawing PNG image"
  );
}

function testProductFormSupportsMultipleImages() {
  assert(html.includes('id="pf_images"'), "product form should use multi-image input");
  assert(html.includes("multiple"), "product image input should allow multiple files");
  assert(html.includes("function onProductImagesChange"), "multi-image change handler should exist");
  assert(html.includes("function removeProductImageItem"), "image removal handler should exist");
  assert(html.includes("function moveProductImageItem"), "image reorder handler should exist");
  assert(html.includes("function setProductImageAsMain"), "set main image handler should exist");
}

function testProductThumbnailUsesFirstImage() {
  assert(html.includes("const mainItem = uploadedItems[0]"), "cover thumbnail should use first image item");
  assert(
    html.includes("createProductThumbnailFile(mainItem.file)"),
    "cover thumbnail should be generated from first new image"
  );
  assert(
    html.includes("editingProductOriginalCoverThumb"),
    "unchanged first image should reuse existing thumbnail"
  );
}

function testCategoryDeleteActionExists() {
  assert(html.includes("function deleteCategory"), "category delete handler should exist");
  assert(html.includes("adminDeleteCategory"), "admin page should call delete category function");
  assert(html.includes("删除分类"), "admin page should expose category delete action");
}

function testAdminIngredientSeparatorUsesBoldDot() {
  assert(!html.includes(".join(' + ')"), "admin product card should not use plus separator");
  assert(
    html.includes("'<strong class=\"ingredient-separator\">·</strong>'"),
    "admin product card should use bold dot separator"
  );
  assert(
    html.includes(".ingredient .ingredient-separator"),
    "admin product card should style ingredient separator"
  );
}

function testProductKeyPointsSupportMultilineEditing() {
  assert(
    html.includes("<textarea") && html.includes("data-prefix=\"${prefix}\""),
    "dynamic text rows should support textarea editing"
  );
  assert(
    html.includes("collectDynamicRows") && html.includes("textarea"),
    "dynamic row collection should read textarea values"
  );
}

function testHotSolutionAdminManagementExists() {
  assert(html.includes('data-tab="solutions"'), "solution tab should be present");
  assert(html.includes('id="solutionSidebar"'), "solution sidebar should be present");
  assert(html.includes("let hotSolutions"), "admin should keep hot solution state");
  assert(html.includes("function loadHotSolutions"), "admin should load hot solutions");
  assert(html.includes("function openHotSolutionForm"), "admin should expose solution form");
  assert(html.includes("function saveHotSolution"), "admin should save hot solutions");
  assert(html.includes("function deleteHotSolution"), "admin should delete hot solutions");
  assert(html.includes("adminCreateHotSolution"), "admin should call create hot solution function");
  assert(html.includes("adminUpdateHotSolution"), "admin should call update hot solution function");
  assert(html.includes("adminDeleteHotSolution"), "admin should call delete hot solution function");
}

function testHotSolutionAdminUploadsImagesAndProductRows() {
  assert(html.includes('id="hs_images"'), "solution form should upload solution images");
  assert(html.includes('id="hs_effectImages"'), "solution form should upload effect images");
  assert(html.includes("hot-solutions/images/"), "solution images should use solution storage path");
  assert(html.includes("hot-solutions/effects/"), "effect images should use effect storage path");
  assert(html.includes("方案名称"), "solution form should include name");
  assert(html.includes("产品名称") && html.includes("含量") && html.includes("厂家"), "solution form should include product rows");
  assert(html.includes("方案特点"), "solution form should include features");
}

Promise.resolve()
  .then(testBannerTabExists)
  .then(testBannerUploadAndDeleteHandlersExist)
  .then(testAdminScriptSyntax)
  .then(testProductFormDoesNotUseRegistrationNumber)
  .then(testProductThumbnailUsesWhiteCanvasBackground)
  .then(testProductFormSupportsMultipleImages)
  .then(testProductThumbnailUsesFirstImage)
  .then(testCategoryDeleteActionExists)
  .then(testAdminIngredientSeparatorUsesBoldDot)
  .then(testProductKeyPointsSupportMultilineEditing)
  .then(testHotSolutionAdminManagementExists)
  .then(testHotSolutionAdminUploadsImagesAndProductRows)
  .then(() => {
    console.log("admin banner behavior tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
