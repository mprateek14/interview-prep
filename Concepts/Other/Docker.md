# Docker

## Commands

docker run imageName - start container from an image. use with -d flag to run in background
docker ps - list all running containers
docker stop cointainerId/containerName - stop container
docker rm containerName - remove the container completely
docker images - list images
dokcer rmi imageName - delete images
docker pull imageName - downlaod iamge but dont run a container from it

docker exec containerName cat /etc/hosts - run commands on a live container

docker inspect containerId/containerName - More detailed info about container
docker logs containerId/containerName



Containers are not meant to run OS. They run as long as some service inside it is running. So if we only do docker run ubuntu, it will stop immediately after starting. But if we do docker run ubuntu bash, the it will also run the bash inside the container and it won't exit.


docker run -p 80:5000 containerName - Map port 80 of host to 5000 of docker isntance
docker run -v /host/data:/var/lib/mysql mysql - Map external directory of host to directory inside container which stores our data