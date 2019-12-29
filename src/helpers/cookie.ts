const cookie = {
  read(name: string): string | null {
    // 通过正则表达式获取cookie
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
