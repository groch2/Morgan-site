pushd C:/Users/deschaseauxr/Documents/Morgan-site/pictures-by-device-type/
gsutil mb gs://morgan-site-test-pictures/
gsutil defacl set public-read gs://morgan-site-test-pictures/
gsutil -m rsync -r ./mobile gs://morgan-site-test-pictures/mobile
gsutil -m rsync -r ./desktop gs://morgan-site-test-pictures/desktop
gsutil -m rsync -r ./tablet gs://morgan-site-test-pictures/tablet
popd