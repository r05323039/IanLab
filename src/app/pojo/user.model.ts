export interface UserModel {
  account: string
  password?:string
  email: string
  userName: string
  birthday: string
  zipcode?: string
  address?: string
  image?: string
}
export class UserModelBuilder {
  private user: UserModel;

  constructor() {
    this.user = {} as UserModel;
  }

  setAccount(account: string): UserModelBuilder {
    this.user.account = account;
    return this;
  }

  setPassword(password: string): UserModelBuilder {
    this.user.password = password;
    return this;
  }

  setEmail(email: string): UserModelBuilder {
    this.user.email = email;
    return this;
  }

  setUserName(userName: string): UserModelBuilder {
    this.user.userName = userName;
    return this;
  }

  setBirthday(birthday: string): UserModelBuilder {
    this.user.birthday = birthday;
    return this;
  }

  setZipcode(zipcode: string): UserModelBuilder {
    this.user.zipcode = zipcode;
    return this;
  }

  setAddress(address: string): UserModelBuilder {
    this.user.address = address;
    return this;
  }

  setImage(image: string): UserModelBuilder {
    this.user.image = image;
    return this;
  }

  build(): UserModel {
    return this.user;
  }
}
