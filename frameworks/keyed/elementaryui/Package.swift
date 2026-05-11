// swift-tools-version: 6.3
import PackageDescription

let package = Package(
    name: "PerformanceBenchmarks",
    platforms: [.macOS(.v15)],
    dependencies: [
        .package(url: "https://github.com/elementary-swift/elementary-ui", exact: "0.2.3")
    ],
    targets: [
        .executableTarget(
            name: "App",
            dependencies: [
                .product(name: "ElementaryUI", package: "elementary-ui")
            ]
        )
    ],
    swiftLanguageModes: [.v5]
)
