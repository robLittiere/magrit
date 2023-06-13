import subprocess

def download_libraries(download_folder):
    update_command = ['sudo', 'apt-get', 'update']
    install_command = [
        'sudo',
        'apt-get', 'install', '-y', '--no-install-recommends',
        '--download-only',
    ]
    default_librairies = ['software-properties-common', 'gcc', 'g++',
        'libpython3.11-dev', 'python3.11', 'python3.11-dev', 'python3-pip',
        'libgeos-c1v5', 'libgeos-dev', 'libgdal30', 'libgdal-dev', 'libspatialindex-dev', 'libffi-dev',
        'nodejs', 'npm', 'redis-server', 'libuv1', 'libuv1-dev', 'unzip', 'wget', 'git',
        'libxslt1.1', 'libxslt1-dev', 'libxml2', 'libxml2-dev', 'libkml-dev', 'locales']

    user_librairies = input("Entrez la liste des librairies à télécharger. Pressez entrer sans écrire pour télécharger par défaut les librairies suivantes : \n\n software-properties-common gcc g++ libpython3.11-dev python3.11 python3.11-dev python3-pip libgeos-c1v5 libgeos-dev libgdal30 libgdal-dev libspatialindex-dev libffi-dev nodejs npm redis-server libuv1 libuv1-dev unzip wget git libxslt1.1 libxslt1-dev libxml2 libxml2-dev libkml-dev locales")

    # Télécharge les librairies par défaut si l'utilisateur n'en spécifie pas, sinon, télécharge les siennes
    if user_librairies == "":
        install_command.extend(default_librairies)
    else:
        input_list = [element.strip("'\"") for element in user_librairies.split(',')]
        install_command.extend(input_list)

    print("\n\n","Packages en téléchargement : \n",install_command[6:])



    mv_command = ['sudo','mv', '/var/cache/apt/archives', download_folder]

    subprocess.run(update_command, check=True) 
    subprocess.run(install_command, check=True)
    subprocess.run(mv_command, check=True)

    """ clone_magrit = ["git","clone","https://github.com/riatelab/magrit"]
    print("Clonage de Magrit CNRS : https://github.com/riatelab/magrit")
    subprocess.run[clone_magrit, check=True] """

download_libraries('/home/saro/magrit/local_docker')
