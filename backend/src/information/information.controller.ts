import { Controller, Get, Param } from "@nestjs/common";
import puppeteer from "puppeteer";
import * as cheerio from 'cheerio'
import axios from "axios";


@Controller('information')
export class InformationController{

  constructor() {
  }
  //Ask Comrade Alexei
  @Get('/:originalUrl')
  async getTitle(@Param('originalUrl') originalUrl: string): Promise<string> {
    try {
      const decodedUrl = decodeURIComponent(originalUrl);
      const { data } = await axios.get(decodedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      const $ = cheerio.load(data);
      const title = $('title').text().trim();
      return title || 'Untitled Page';
    } catch (error) {
      console.error('Failed to fetch title:', error.message);
      return 'Untitled Page';
    }
  }
  @Get('test')
  async getTest(){
    console.log("Handler reached");
  }
}