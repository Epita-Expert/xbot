import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NeogeolocService {
  private readonly logger = new Logger(NeogeolocService.name);
  constructor(private readonly httService: HttpService) {}

  public async postFakeLocation(token: string) {
    const getRandomLon = Math.random() * (48.81505 - 48.81485) + 48.81485;
    const getRandomLat = Math.random() * (2.36278 - 2.36245) + 2.36245;
    const d = new Date();
    this.logger.log(
      `Posting fake location at ${getRandomLon}, ${getRandomLat}`,
    );
    const endpoint = '/ajax/divers/callbackForm.php';
    const data = {
      action: 'addgeoloc',
      token,
      code: '',
      latitude: getRandomLon,
      longitude: getRandomLat,
      altitude: '',
      date:
        [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') +
        ' ' +
        [d.getHours(), d.getMinutes(), d.getSeconds()].join(':'),
      type: '6',
      fingerprint: 'ffc5497021c76f16c10ef42a0524c324',
      version: '2.2.0',
      urgence: '0',
      mobile: 'false',
      touchDevice: 'false',
      maxTouchPoints: '0',
      'positions[0][latitude]': getRandomLat,
      'positions[0][longitude]': getRandomLon,
      'positions[0][accuracy]': '10',
      'positions[0][altitude]': '',
      'positions[0][altitudeAccuracy]': '',
      'positions[0][heading]': '',
      'positions[0][speed]': '',
      'positions[1][latitude]': getRandomLat,
      'positions[1][longitude]': getRandomLon,
      'positions[1][accuracy]': '10',
      'positions[1][altitude]': '',
      'positions[1][altitudeAccuracy]': '',
      'positions[1][heading]': '',
      'positions[1][speed]': '',
      'positions[2][latitude]': getRandomLat,
      'positions[2][longitude]': getRandomLon,
      'positions[2][accuracy]': '10',
      'positions[2][altitude]': '',
      'positions[2][altitudeAccuracy]': '',
      'positions[2][heading]': '',
      'positions[2][speed]': '',
      'positions[3][latitude]': getRandomLat,
      'positions[3][longitude]': getRandomLon,
      'positions[3][accuracy]': '10',
      'positions[3][altitude]': '',
      'positions[3][altitudeAccuracy]': '',
      'positions[3][heading]': '',
      'positions[3][speed]': '',
      'positions[4][latitude]': getRandomLat,
      'positions[4][longitude]': getRandomLon,
      'positions[4][accuracy]': '10',
      'positions[4][altitude]': '',
      'positions[4][altitudeAccuracy]': '',
      'positions[4][heading]': '',
      'positions[4][speed]': '',
      vw: '1920',
      vh: '937',
    };
    return new Promise<any>((resolve, reject) => {
      this.httService.post(endpoint, data).subscribe({
        next: (response) => {
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
