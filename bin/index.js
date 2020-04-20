#!/usr/bin/env node

'use strict';
const inquirer = require('inquirer');
const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const { fetch } = require('umi-request');

const warning = chalk.keyword('orange');
const projectUrl = 'https://act.hbtv.com.cn/app/projects/projects.json';

function start() {
  fetch(projectUrl)
    .then((res) => res.json())
    .then((projects) => {
      const options = [
        {
          type: 'list',
          name: 'project',
          message: '选择你要安装的项目',
          choices: projects.map((project) => project.label),
          filter: function (val) {
            return projects.find((project) => project.label === val);
          },
        },
        {
          type: 'input',
          name: 'username',
          message: '你的用户名',
        },
        {
          type: 'password',
          name: 'password',
          message: '你的密码',
        },
      ];

      inquirer.prompt(options).then((chooseProject) => {
        const { username, password, project } = chooseProject;
        const { repository = '', afterTip = null } = project;

        const url = `direct:https://${username}:${password}@${repository.split('//')[1]}`;

        const spinnerDownload = ora({
          color: 'yellow',
          text: `正在下载 `,
        });
        spinnerDownload.start();
        download(url, './', { clone: true }, function (err) {
          if (err) {
            spinnerDownload.fail('发送错误了');
            return;
          }
          spinnerDownload.succeed('下载完成.');
          if (afterTip) {
            console.log(warning(afterTip));
          }
        });
      });
    })
    .catch(() => {
      console.log('不能获取项目列表');
    });
}

start();
