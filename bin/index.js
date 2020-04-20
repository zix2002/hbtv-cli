#!/usr/bin/env node

'use strict';
const inquirer = require('inquirer');
const download = require('./download');
const ora = require('ora');
const chalk = require('chalk');
const { fetch } = require('umi-request');
const program = require('commander');

const warning = chalk.keyword('orange');
const projectsUrl = 'https://act.hbtv.com.cn/app/projects/projects.json';

function start() {
  fetch(projectsUrl)
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
      ];

      inquirer.prompt(options).then((chooseProject) => {
        const { project } = chooseProject;
        const { repository = '', afterTip = null } = project;

        const spinnerDownload = ora({
          color: 'yellow',
          text: `正在下载 `,
        });
        spinnerDownload.start();
        download(repository, function (err) {
          if (err) {
            spinnerDownload.fail('用户名或密码错了, 或目录不空');
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

program.version('1.1.0', '-v, --version').action(() => {
  start();
});
program.parse(process.argv);
