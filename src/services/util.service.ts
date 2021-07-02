import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {genSalt, hash} from 'bcryptjs';
const satelize = require('satelize');
const zipcodes = require('zipcodes');
@injectable({scope: BindingScope.TRANSIENT})
export class UtilService {
  constructor(/* Add @inject to inject parameters */) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGeoLocation(ip: string): Promise<any> {
    return new Promise((resolve, reject) => {
      satelize.satelize(
        {
          ip,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any, response: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        },
      );
    });
  }

  getRandomText(length: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const charset: any = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.match(/./g);
    let text = '';
    for (let i = 0; i < length; i++)
      text += charset[Math.floor(Math.random() * charset.length)];
    return text;
  }

  async generateHash(key?: string): Promise<{key: string; hash: string}> {
    let keyValue = key;
    if (!keyValue) {
      keyValue = this.getRandomText(10);
    }
    const salt = await genSalt(10);
    const hashValue = await hash(keyValue, salt);
    return {
      key: keyValue,
      hash: hashValue,
    };
  }

  generateRandomNumber(length = 4) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 1; i <= length; i++) {
      const index = Math.floor(Math.random() * digits.length);
      otp = otp + digits[index];
    }
    return otp;
  }

  generateQuery(field:string,value:Array<string>,operation:string){

    let query = `${field}:(`;

    if(operation === 'OR'){
      value.map(function(val,index){
        if(index !== (value.length - 1)){
         query += `${val} OR `
         return query
        }else{
         query += `${val})`
        }
      });
    }

    if(operation === 'AND'){
      value.map(function(val,index){
        if(index !== (value.length - 1)){
         console.log(query += `${field}:${val} AND `)
         return query
        }
      });
    }

    return query;
  }

  async getZipCodeByRadius(zipCode:number,radius:number){
    return zipcodes.radius(zipCode, radius);
  }
  
}
