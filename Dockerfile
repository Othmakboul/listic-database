FROM mongo:latest
# Copy data to the image for archival/reference purposes
COPY . /data/listic_data
CMD ["mongod"]
