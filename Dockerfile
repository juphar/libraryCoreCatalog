FROM node:8

	ADD ./app /app
	WORKDIR /app

	EXPOSE 8080
	
	ENV NODE_ENV production

	RUN npm install
	
	CMD ["npm", "start"]
