#!/bin/bash
get_environment() {
  declare -A branch_env_mapping=(
    ["release/current"]="staging"
    ["develop"]="dev"
    ["master"]="prod"
  )

  branch_name="$1"
  tgs_env=${branch_env_mapping["$branch_name"]}

  if [ -z "$tgs_env" ]; then
    echo "Unsupported branch for deployment"
    exit 1
  fi

  echo "$tgs_env"
}

deploy_brands() {
  for ((index=0; index<=total_brands; index++)); do
    deploy=$(echo "$YAML_CONTENT" | yq eval ".brands[$index].deploy" -)
    site=$(echo "$YAML_CONTENT" | yq eval ".brands[$index].site" -)
    lang=$(echo "$YAML_CONTENT" | yq eval ".brands[$index].lang" -)
    brand=$(echo "$YAML_CONTENT" | yq eval ".brands[$index].brand" -)

    echo "Processing brand: $brand, $deploy, $site, $lang"

    image_tag="pgtgs/${deploy}:$Tag"
    
    npm run gitlab-build -- BRAND=${brand} API_URL=/ SITE=${site} DEFAULT_LANGUAGE=${lang} vite build -m prod
    echo "image_tag=$image_tag"
    
    docker build -t $image_tag .
    docker push $image_tag
    kubectl set image deployment/$deploy $deploy=$image_tag -n $tgs_env
    echo "=============="
  done
}
