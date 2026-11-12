echo "Upload escaparametro..."
rsync -avz --delete \
  --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='/public/uploads' \
  -e "ssh -p 8212" \
  . depinf@88.2.194.64:./feria/escaparametro

