import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from 'src/app/client/client.service';
import { Client } from 'src/app/client/model/Client';
import { GameEditComponent } from 'src/app/game/game-edit/game-edit.component';
import { GameService } from 'src/app/game/game.service';
import { Game } from 'src/app/game/model/Game';
import { LoanService } from '../loan.service';
import { Loan } from '../model/Loan';

@Component({
  selector: 'app-loan-create',
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.scss']
})
export class LoanCreateComponent implements OnInit {
  loan: Loan; 
  games: Game[];
  clients: Client[];
  endBeforeBegin: Boolean;
  loanTooLong: Boolean;

  constructor(
    public dialogRef: MatDialogRef<GameEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gameService: GameService,
    private clientService: ClientService,
    private loanService: LoanService,
  ) { }  

  ngOnInit(): void {
    this.loan = new Loan();
  
    this.gameService.getGames().subscribe(
        games => {
            this.games = games;
        }
    );

    this.clientService.getClients().subscribe(
      clients => {
        this.clients = clients
      }
    );
  }

  checkDates(){
    const beginDate = new Date(this.loan.begin);
    const endDate = new Date(this.loan.end);
    let differenceInTime = endDate.getTime() - beginDate.getTime();
    // To calculate the no. of days between two dates
    let differenceInDays = differenceInTime / (1000 * 3600 * 24);
    
    this.endBeforeBegin = false;
    this.loanTooLong = false;
    //Fecha end menor que begin o préstamo de más de 14 días
    if(differenceInDays < 0 ){
      this.endBeforeBegin = true;
    }
    else if(differenceInDays > 14){
      this.loanTooLong = true;
    }
  }

  onSave() {
    if(!this.endBeforeBegin && !this.loanTooLong){
      this.loanService.saveLoan(this.loan).subscribe({
        next: () => { this.dialogRef.close() },
        error: (error: HttpErrorResponse) => {
          alert(error.error.message);
          this.dialogRef.close();
        }
      });
    }
    else{
      this.dialogRef.close();
    }
        
  }  

  onClose() {
      this.dialogRef.close();
  }
}
