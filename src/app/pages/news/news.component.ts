import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api/api.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  loadingNews: boolean = false;
  news: Array<any>;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadNews();
  }

  loadNews(){
    this.loadingNews = true;
    this.api.getNews()
    .subscribe((res)=>{
      this.loadingNews = false;
      if(res.success){
        this.news = res.data.reverse();
      }
    })
  }

}
