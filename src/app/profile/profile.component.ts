import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  movies: any[] = [];
  username: any = localStorage.getItem('user');
  favoriteMovies: any[] = [];
  displayElement: boolean = false

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getFavorites();
    console.log(this.getUser);
  }

  /**
  * Calls API endpoint to get user info
  * @function getUserProfile
  * @param user
  * @return user data in JSON format
  */
  getUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.fetchApiData.getUserProfile().subscribe((response: any) => {
        this.user = response;
        console.log(this.user);
        return this.user;
      });
    }
  }

  /**
   * edits user info from profile page
   * @function editUserProfile
   */
  openEditProfileDialog(): void {
    this.dialog.open(ProfileComponent, {
      width: '300px'
    })
  }

  /**
  * deletes user account when on profile page
  * @function deleteUserProfile
  */
  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your account? This cannnot be undone.')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('You have successfully deleted your account!', 'OK', {
          duration: 2000
        });
      })
      this.fetchApiData.deleteUserProfile().subscribe((response) => {
        console.log(response);
        localStorage.clear();
      });
    }
  }
  /**
   * function to let the user display their favorited movies 
   * @function getAllMovies
   */
  getFavorites(): void {
    let movies: any[] = [];
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      movies = res;
      movies.forEach((movie: any) => {
        if (this.user.FavoriteMovie.includes(movie._id)) {
          this.favoriteMovies.push(movie);
          this.displayElement = true;
        }
      });

    });
  }
  /**
   * function to let the user remove a movie from their favorited movies
   * @function removeFavoriteMovie
   */
  removeFavoriteMovie(id: string): void {
    this.fetchApiData.deleteFavoriteMovies(id).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(
        `Removed from your favourites!`,
        'OK',
        {
          duration: 3000,
        });
      this.ngOnInit();
    });
  }
}