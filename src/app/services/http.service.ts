import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/emvironment';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
  ) { }

  get(serviceName: string,page:string) {
    const url = `${environment.apiUrl}/wp-json/${environment.version}/${serviceName}consumer_key=${environment.consumerKey}&consumer_secret=${environment.consumerSecret}&page=${page}&per_page=100`;
    return this.http.get(url, { observe: 'response' });
  }
}
