files=$(ls dist/app.*.js 2> /dev/null | wc -l)
if [ "$files" != "0" ]
then
  echo "Replacing files in /magrit_app/static/dist/ folder..."
  mkdir -p ../magrit_app/static/dist/
  rm -rf ../magrit_app/static/dist/app.*.js
  rm -rf ../magrit_app/static/dist/vendor.*.js
  rm -rf ../magrit_app/static/dist/*.wasm
  cp dist/app.*.js ../magrit_app/static/dist/
  cp dist/vendor.*.js ../magrit_app/static/dist/
  cp css/style-fonts.css ../magrit_app/static/dist/style-fonts.css
  cp js/webworker* ../magrit_app/static/dist/
  cp dist/html/modules.html ../magrit_app/static/
  cp html/contact_form.html ../magrit_app/static/
  cp html/index.html ../magrit_app/static/
  cp html/page404.html ../magrit_app/static/
else
    echo "Nothing to be replaced..."
fi
