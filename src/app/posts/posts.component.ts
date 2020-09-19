import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PostsService} from '../services/posts.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: any[];
  displayedColumns: string[] = ['id', 'title'];
  dataSource = null;
  search: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private potsService: PostsService) {
    this.getPots();
  }

  ngOnInit(): void {

  }

  filterData(event): void {
    let filterValue = event.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  private getPots(): void {
    this.potsService.getPots().subscribe((data) => {
      this.initTable(data);
    });
  }

  private initTable(data): void {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
