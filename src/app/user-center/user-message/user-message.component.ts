import {Component, OnInit} from '@angular/core';
import {UserHttpService} from "../../user-http-service";
import {MessageModel} from "../../pojo/message.model";
import {UserModel} from "../../pojo/user.model";
import {exhaustMap, take} from "rxjs";


@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css'],
})
export class UserMessageComponent implements OnInit {
  //獲得當前user物件，拿account找MSG
  user: UserModel
  messages: MessageModel[]
  //複選框
  checkboxChecked: boolean = false;
  //分頁
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageNumbers: number[] = [];
  //彈窗，傳進@input
  inputMsg: MessageModel | null = null


  constructor(private userHttpService: UserHttpService,) {
  }

  ngOnInit(): void {
    this.userHttpService.userSubject.subscribe(user => {
      this.user = user
    })
    this.initializeComponent()
  }

  //初始化組件
  initializeComponent(): void {
    this.messages = [];
    this.currentPage = 1;
    this.pageNumbers = [];

    this.userHttpService.findMsg(this.user.account)
      .subscribe(response => {
        //存放到本組件
        this.messages = response.resEntity;
        //計算分頁
        const totalPages: number = Math.ceil(this.messages.length / this.itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
          this.pageNumbers.push(i);
        }
      });
  }

  //取得目前分頁第一筆資料index
  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage
  }

  //導向第n頁
  toPage(num: number) {
    this.currentPage = num
  }

  //上一頁
  toPrev() {
    if (this.currentPage > 1)
      this.currentPage--
  }

  //下一頁
  toNext() {
    const totalPages: number = Math.ceil(this.messages.length / this.itemsPerPage);
    if (this.currentPage < totalPages)
      this.currentPage++
  }

  //複選框全選
  selectAll() {
    this.checkboxChecked = !this.checkboxChecked
    this.messages.forEach((msg) => {
      msg.checked = this.checkboxChecked
    })
  }

  //刪除訊息
  onDelete() {
    //獲得選取的數組
    const ids =
      this.messages
        .filter(msg => msg.checked)
        .map(msg => msg.msgId)

    //沒勾選複選框
    if (ids.length < 1) {
      window.alert('請選取要刪除的訊息')
      return
    }

    //彈出確認視窗
    const confirmDelete: boolean = window.confirm('是否刪除' + ids.length + '筆訊息？');
    if (confirmDelete) {
      //刪除API
      this.userHttpService.deleteMessage(ids)
        .subscribe(response => {
          if (response.message === '000') {
            //成功後執行畫面初始化
            this.initializeComponent();
          }
        })
    }
  }

  //點擊欄位標題
  onTitle(msg: MessageModel) {
    //將物件傳入子組件 @input
    this.inputMsg = msg;
  }

  //從彈窗刪除
  deleteByDialog() {
    //封裝數據
    const ids: number[] = []
    ids.push(this.inputMsg.msgId)
    //API
    this.userHttpService.deleteMessage(ids)
      .subscribe(response => {
        if (response.message === '000') {
          //成功後執行畫面初始化
          this.initializeComponent();
          //關閉彈窗
          this.inputMsg = null;
        }
      })
  }

  getTestData(){
    this.userHttpService.genMse(this.user.account)
      .subscribe(()=>{
        this.initializeComponent()
      })
  }
}
