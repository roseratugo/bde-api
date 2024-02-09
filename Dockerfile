# Utilisez l'image officielle Node.js comme image de base
FROM node:14

# Définissez le répertoire de travail dans le conteneur
WORKDIR /usr/src/server

# Copiez les fichiers de définition des dépendances
COPY package*.json ./

# Installez les dépendances du projet
RUN npm install

# Copiez les fichiers et dossiers du projet dans le répertoire de travail du conteneur
COPY . .

# Exposez le port sur lequel l'application s'exécute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]
