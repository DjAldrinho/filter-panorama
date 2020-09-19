import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PostsService} from '../services/posts.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl, FormGroup} from '@angular/forms';
import {merge, Observable} from 'rxjs';
import {UsersService} from '../services/user.service';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: any[];
  filters: any[] = [{id: 'userId', name: 'User'}];
  filtersShow: any[];
  form: FormGroup = new FormGroup({
    id: new FormControl(false),
    title: new FormControl(false),
    body: new FormControl(false),
    userId: new FormControl(false),
  });
  users: any[];
  id = this.form.get('id');
  title = this.form.get('title');
  body = this.form.get('body');
  userId = this.form.get('userId');

  displayedColumns: any[] = [
    {def: 'select', label: '', hide: false},
    {def: 'id', label: 'ID', hide: this.id.value},
    {def: 'title', label: 'Title', hide: this.title.value},
    {def: 'body', label: 'Body', hide: true},
    {def: 'user', label: 'User', hide: false},
    {def: 'userId', label: 'UserID', hide: true},
    {def: 'actions', label: 'Actions', hide: false},
  ];
  cbValues = null;
  dataSource = null;
  search: string;
  showColumnUser = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: ElementRef;


  constructor(private potsService: PostsService,
              private userService: UsersService) {
    this.users = [];
    this.filtersShow = [];
    this.getUsers();
    this.getPots();
  }

  ngOnInit(): void {
  }

  filterData(event): void {
    if (_.isNumber(event)) {
      event = event.toString();
    }
    let filterValue = event.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getDisplayedColumns(): any {
    return this.displayedColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  addFilter(f: any): void {
    this.filtersShow.push(f);
  }

  removeFilter(index: number): void {
    this.filtersShow.splice(index, 1);
    this.filterData('');
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  export(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Posts.xlsx');
  }

  private getPots(): void {
    this.potsService.getPots().subscribe((data) => {
      this.initTable(data);
    }, (error) => {
      console.error(error);
    });
  }


  private initTable(data): void {
    const finalData = [];
    data.forEach((item) => {
      const user = this.users.filter((u) => item.userId === u.id);
      finalData.push({
        id: item.id,
        title: item.title,
        userId: item.userId,
        user: user[0].name
      });
    });

    this.dataSource = new MatTableDataSource<any>(finalData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const o1: Observable<boolean> = this.id.valueChanges;
    const o2: Observable<boolean> = this.title.valueChanges;
    const o3: Observable<boolean> = this.body.valueChanges;
    const o4: Observable<boolean> = this.userId.valueChanges;

    merge(o1, o2, o3, o4).subscribe(v => {
      this.displayedColumns[0].hide = this.id.value;
      this.displayedColumns[1].hide = this.title.value;
      this.displayedColumns[2].hide = this.body.value;
      this.displayedColumns[3].hide = this.userId.value;
    });
  }


}
