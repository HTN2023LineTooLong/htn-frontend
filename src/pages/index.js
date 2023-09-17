import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { Image, Flex, Button, Input, Grid, GridItem, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [files, setFiles] = useState('value');
  const [queueTime, setQueueTime] = useState('');
  const [totalPeople, setTotalPeople] = useState(0);
  const [averageServiceTime, setAverageServiceTime] = useState(0);

  useEffect(() => {
    if (totalPeople > 0 && averageServiceTime > 0) {
      var date = new Date(null);
      date.setSeconds(totalPeople * averageServiceTime); 
      var hhmmssFormat = date.toISOString().substr(11, 8);
      console.log(hhmmssFormat);
      setQueueTime(hhmmssFormat);
    }
  }, [totalPeople, averageServiceTime]);

  const postImage = async (event) => {
    event.preventDefault();
    let formData = new FormData();
    for(let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch("http://127.0.0.1:8082/detect-people-photo", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      console.log('\nDATA\n', data);
      console.log(data.total_people);
      setTotalPeople(data.total_people);
    } catch (err) {
      console.log('\n ERROR \n', err);
    }
  }

  const postVideo = async (event) => {
    event.preventDefault();
    let formData = new FormData();
    for(let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch("http://127.0.0.1:8082/detect-people-video", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      console.log('\nDATA\n', data);
      console.log(data.average_service_time);
      setAverageServiceTime(data.average_service_time)
    } catch (err) {
      console.log('\n ERROR \n', err);
    }
  }
  
  const handleInput = async (event) => {
    setFiles(event.target.files);
  }

  return (
    <>
      <Head>
        <title>Funnel Cake Line Too Long</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/funnelIcon.png" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Grid 
          templateColumns='repeat(3, 1fr)'
          templateRows='2fr 1fr'
          >
            <GridItem>
              <Flex>
                <form onSubmit={ postImage } method='post'>
                  <Input
                    placeholder="Upload media"
                    size="md"
                    type="file"
                    onChange={(e) =>  handleInput(e) }
                    multiple
                  />
                  <Button colorScheme='blue' type='submit'>Upload Images</Button>
                </form>
              </Flex>
            </GridItem>
            <GridItem>
              <Image src='/funnelIcon.png' h='300px' alt='File not found' />
              <Image src='/cake.png' h='300px' alt='File not found' />
            </GridItem>
            <GridItem>
              <Flex>
                <form onSubmit={ postVideo } method='post'>
                  <Input
                    placeholder="Upload Video"
                    size="md"
                    type="file"
                    onChange={(e) =>  handleInput(e) }
                    multiple
                  />
                  <Button colorScheme='blue' type='submit'>Upload Video</Button>
                </form>
              </Flex>
            </GridItem>
            <GridItem/>
            <GridItem>
              <Text fontSize='5xl'>Queue Time:</Text>
              <Text fontSize='5xl'>{queueTime}</Text>
            </GridItem>
        </Grid>
      </main>
    </>
  )
}
