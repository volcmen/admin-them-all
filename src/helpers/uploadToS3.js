import AWS from 'aws-sdk';

const albumBucketName = '<BucketName>';
const bucketRegion = '<Region>';
const IdentityPoolId = '<PoolId>';

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId,
    }),
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: albumBucketName },
});


const addPhoto = (albumName, file) => new Promise((resolve, reject) => {
    if (!file.name) return reject();

    console.log('log', albumName);

    // if (!files.length) {
    //     return reject('Please choose a file to upload first.');
    // }
    // let file = files;

    const date = Date.now();


    let fileName;

    if (albumName === 'images')
        fileName = file.name.replace(/\.[^/.]+$/, `_${date}.jpg`);
     else
        fileName = file.name;


    const albumPhotosKey = `${encodeURIComponent(albumName)}/`;


    const photoKey = albumPhotosKey + fileName;

    console.log('pre upload');

    return s3.upload({
        Key: photoKey,
        Body: file,
        ACL: 'public-read',
    }, (err, data) => {
        if (err)
            return reject(`There was an error uploading your photo: ${err.message}`);


        console.log('succ', data);
        resolve(data.Location);
    })
        .on('httpUploadProgress', (progress) => {
            console.log('httpUploadProgress', parseInt(((progress.loaded * 100) / progress.total), 10));
        });
});

export default addPhoto;
