## So you want to contribute

First of all thanks for you consideration. There is a couple steps to take.

### Setup

First things first you will need a copy of the code using [git](http://git-scm.com/)&amp;s clone command.

    $ git clone https://github.com/jcblw/vsvg.git

Next make sure your code has all the dependecies it needs to run properly using [npm](https://www.npmjs.com/) install in the projects directory.

    $ npm install 

Now you can run code properly, and start hacking on it! 

### Testing

Once you get to a point and you want to check your code run. 

    $ npm test

This will test your code against exsisting functionality to make sure your new code does not introduce [regressions](http://en.wikipedia.org/wiki/Software_regression). If it passes test out your new functionality or see if you squashed the bug by either adding a test ( located in the `./test` directory ) or try it in another project. You can easily add it into a project that is already using the module by runing.

    $ npm link

In the root directory of this project, and the going to your other project and running.

    $ npm link vsvg

### Submiting Pull Request

You will need to publish your code to [Github](https://github.com) to make a pull request. You can do this by [forking](https://help.github.com/articles/fork-a-repo/) this repository ( There is a button in the right top corner on desktop ). Push you code to your forked repo to Github using `git push`. Now you can make a pull request and by making a pull request you must agree to the repos code of conduct. V

If this is your first pull request check out this resource on how to use [GitHub pull requests](https://help.github.com/articles/using-pull-requests).

### Code of Conduct

All contributer, participants, and maintainers of this repo are required to agree with the following code of conduct. Maintainers will enforce this code. We are expecting coorporation from all participants to help ensuring a safe environment for everybody.

tl;dr - Do not be a JERK.

#### All of it

Maintainers are dedicated to providing a harassment-free participation for everyone, regardless of gender, sexual orientation, disability, physical appearance, body size, race, or religion. We do not tolerate harassment of any participants in any form. Sexual language and imagery is not appropriate for any avenue of participation, including issues, commit messages, and pull request. Repo participants violating these rules may be censored and probably will be blocked for further engagments in this repo.
