/**
 * 双向链表
 */

export default function DoublyLinkedList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
  function Node(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
  // 向后添加节点
  this.append = function (data) {
    var newNode = new Node(data);
    if (this.length == 0) {
      this.head = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
    }
    this.tail = newNode;
    this.length += 1;
  }
  // 正向输出元素的值
  this.toString = function () {
    var current = this.head;
    var str = '';
    while (current) {
      str += current.data + ' ';
      current = current.next;
    }
    return str;
  }

  // 反向输出元素的值
  this.backwardString = function () {
    var current = this.tail;
    var str = '';
    //依次向前遍历，获取每一个节点
    while (current) {
      str += current.data + ' ';
      current = current.prev;
    }
    return str;
  }

  // 插入节点
  this.insert = function (position, data) {
    var newNode = new Node(data);
    //越界判断，如果不满足，返回false
    if (position < 0 || position > this.length) {
      return false;
    } else {
      //再次判断
      //如果链表为空，直接插入
      if (position == 0) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        //如果链表不为空
        //如果插入位置为末尾
        if (position == this.length) {
          this.tail.next = newNode;
          newNode.prev = this.tail;
          this.tail = newNode;
        } else if (position == 0) {
          //如果插入位置为首位
          this.head.prev = newNode;
          newNode.next = this.head;
          this.head = newNode;
        } else {
          //如果插入位置为中间
          var index = 0;
          var current = this.head;
          while (index++ < position) {
            current = current.next;
          }
          newNode.next = current;
          newNode.prev = current.prev;
          current.prev.next = newNode;
          current.prev = newNode;

        }
        this.length += 1;
      }
    }
  }

  // 获取指定位置的节点（二分查找）
  this.get = function (position) {
    if (position < 0 || position >= this.length) {
      return false;
    } else {
      var len = Math.floor(this.length / 2);
      if (position <= len) {
        var index = 0;
        var current = this.head;
        while (index++ < position) {
          current = current.next;
        }
      } else {
        var index = this.length - 1;
        var current = this.tail;
        while (index-- > position) {
          current = current.prev;
        }
      }
      return current.data;
    }
  }

  // 索引
  this.indexOf = function (data) {
    var current = this.head;
    var index = 0;
    while (current) {
      if (current.data === data) {
        return index;
      }
      current = current.next;
      index++;
    }
    return -1;
  }

  // 更新某个位置的节点
  this.update = function (position, newData) {
    if (position < 0 || position >= this.length) {
      return false;
    } else {
      var index = 0;
      var current = this.head;
      while (index++ < position) {
        current = curent.next;
      }
      current.data = newData;
      return true;
    }
  }

  // 从列表中的某个位置移除某一项
  this.removeAt = function (position) {
    if (position < 0 || position >= this.length) {
      return null;
    } else {
      var current = this.head;
      if (this.length === 1) {
        //链表长度为1
        this.head = null;
        this.tail = null
      } else {//链表长度不为1
        if (position === 0) {
          //删除首位
          this.head.next.prev = null;
          this.head = this.head.next;
        } else if (position === this.length - 1) {
          this.tail.prev.next = null;
          this.tail = this.tail.prev;
        } else {
          var index = 0;
          while (index++ < position) {
            current = current.next;
          }
          current.prev.next = current.next;
          current.next.pre = current.prev;
        }
      }
      this.length -= 1;
      return current.data;
    }
  }

  // 移除某个指定的元素
  this.remove = function (data) {
    var index = this.indexOf(data);
    return this.removeAt(index);
  }

  // 空值判断
  this.isEmpty = function () {
    return this.length == 0;
  }

  // 返回链表大小
  this.size = function () {
    return this.length;
  }
}